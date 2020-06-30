import { MockRequest } from '@delon/mock';

const DATA = [
  {
    name: 'Việt Nam',
    id: '100000',
  },
];

export const GEOS = {
  '/geo/province': () => DATA.filter((w) => w.id.endsWith('0000')),
  '/geo/:id': (req: MockRequest) => {
    const pid = (req.params.id || '100000').slice(0, 2);
    return DATA.filter(
      (w) => w.id.slice(0, 2) === pid && !w.id.endsWith('0000')
    );
  },
};
