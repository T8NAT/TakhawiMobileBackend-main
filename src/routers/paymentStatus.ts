import { Router, Request, Response } from 'express';
import pug from 'pug';

const router = Router();

router.get('/:status', (req: Request, res: Response) => {
  const { status } = req.params;
  const { errorMessage } = req.query;
  if (status === 'success') {
    const html = pug.renderFile('./src/templates/paymentResponse.pug', {
      status: true,
    });
    res.send(html);
  } else {
    const html = pug.renderFile('./src/templates/paymentResponse.pug', {
      status: false,
      errorMessage,
    });
    res.send(html);
  }
});

export default router;
