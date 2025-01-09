import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Product from './../models/product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search = '', limit = 10, cursor = null } = req.query;

    const filter: Record<string, any> = search
      ? { name: { $regex: search as string, $options: 'i' } }
      : {};

    const queryLimit = Number(limit);
    console.log(cursor);
    const queryCursor = cursor ? { _id: { $gt: cursor } } : {};  

    const products = await Product.find({ ...filter, ...queryCursor })
      .sort({ _id: 1 })  
      .limit(queryLimit)
      .exec();

    const totalProducts = await Product.countDocuments(filter);
    
    const avgPriceResult = await Product.aggregate([
      { $match: filter }, 
      { $group: { _id: null, avgPrice: { $avg: "$price" } } }
    ]);

    const avgPrice = avgPriceResult.length > 0 ? avgPriceResult[0].avgPrice : 0;

    const totalPages = Math.ceil(totalProducts / queryLimit);

    res.json({
      products,
      totalProducts,
      totalPages,
      cursor: products.length > 0 ? products[products.length - 1]._id : null,
      avgPrice, 
    });
  } catch (err) {
    res.status(500).json({ message: err || 'Щось пішло не так' });
  }
};

export const getProduct = async (req: any, res: any) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(500).json({ message: 'Продукт не знайдено' });
    }
    res.json({
      product
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};




export const createProduct = async (req: any, res: any) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price } = req.body;

  const product = new Product({ name, description, price });

  try {
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

export const deleteProduct = async (req: any, res: any) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Продукт не знайдено' });
    }
    res.status(204).json({ message: 'Продукт видалено' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};


export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return; 
  }

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Продукт не знайдено' });
      return;
    }

    const isChanged = Object.keys(req.body).some((key) => {
      return req.body[key] !== (product as { [key: string]: any })[key];
    });

    if (!isChanged) {
      res.status(200).json({ message: 'Продукт не змінено' });
      console.log('Response sent:', { message: 'Продукт не змінено' });  
      return;
    } else {
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json({ message: 'Продукт змінено' });
      console.log('Response sent:', { message: 'Продукт змінено' });  
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Внутрішня помилка сервера' });
  }
};