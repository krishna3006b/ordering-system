// src/app/api/shipping/calculate/route.ts
import { Body, Controller, Post, Request, Response } from 'express';
import { calculateShipping } from '../services/shipping';

@Controller('shipping')
export class ShippingController {
  @Post('/calculate')
  async calculateShippingRoute(
    @Request() req: Request,
    @Response() res: Response
  ): Promise<Response> {
    try {
      const { body } = req;
      const { address, items } = body;

      // Safe optional chaining and default fallbacks
      const country = address?.country || 'Unknown';
      const city = address?.city || 'Unknown';
      const itemsPrice = items?.map((item) => item.price).reduce((a, b) => a + b, 0) || 0;

      const shippingCost = await calculateShipping(country, city, itemsPrice);
      return res.json({ shippingCost });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}