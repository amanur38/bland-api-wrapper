import express, { Request, Response } from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import isNil from 'lodash/isNil';
import { allowedOrigins, blandApiKey } from './env';

const app = express();
const PORT = 4000;

app.use(express.json());

const allowedOriginsList = allowedOrigins?.split(',') || [];
app.use(cors({
  origin: (origin, callback) => {
    // When origin is undefine, mean is not a browser
    if (isNil(origin) || (!isNil(origin) && allowedOriginsList.includes(origin))) {
      return callback(null, true);
    }
    console.error('🚀 ~ origin:', origin);
    callback(new Error('Not allowed by CORS'));
  }
}));

app.post('/start-call', async (req: Request, res: Response) => {
  const { phone_number, pathway_id } = req.body;

  if (isNil(phone_number) || isNil(pathway_id)) {
    return res.status(400).json({ error: 'phone_number and pathway_id are required' });
  }

  try {
    const blandResponse = await fetch('https://api.bland.ai/v1/calls', {
      method: 'POST',
      headers: {
        'authorization': blandApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone_number, pathway_id })
    });

    const data = await blandResponse.json();
    res.status(blandResponse.status).json(data);

    // res.status(200).json({ message: 'Stub: Call would be made here.' });
  } catch (error: any) {
    console.error('Error forwarding request:', error);
    res.status(500).json({ error: 'Internal server error', message: error.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`API wrapper listening on port http://localhost:${PORT}`);
});
