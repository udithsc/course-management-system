import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { addFactor, loadFactors, selectFactors } from '../factors';
import configureStore from '../configureStore';

const factors = {
  statusCode: null,
  data: [
    {
      id: 1,
      name: 'CHANNEL',
      type: 'Literal',
      factorValueList: [
        {
          id: 1,
          lower: null,
          operator: null,
          upper: null,
          value: 'SIM_BANKING'
        }
      ]
    }
  ],
  pageSize: null,
  totalPages: null
};

describe('factorsSlice', () => {
  let fakeAxios;
  let store;

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const factorsSlice = () => store.getState().factors;

  const createState = () => ({
    factors: {
      list: []
    }
  });

  describe('loading factors', () => {
    // describe('if the factors exist in the cache', () => {
    //   it('they should not be fetched from the server again.', async () => {
    //     fakeAxios.onGet('/factors').reply(200, [{ id: 1 }]);

    //     await store.dispatch(loadFactors());
    //     await store.dispatch(loadFactors());

    //     expect(fakeAxios.history.get.length).toBe(1);
    //   });
    // });

    describe("if the factors don't exist in the cache", () => {
      it('they should be fetched from the server and put in the store', async () => {
        fakeAxios.onGet('/factors').reply(200, factors);

        await store.dispatch(loadFactors());

        expect(factorsSlice().list).toHaveLength(1);
      });

      describe('loading indicator', () => {
        it('should be true while fetching the factors', () => {
          fakeAxios.onGet('/factors').reply(() => {
            expect(factorsSlice().loading).toBe(true);
            return [200, factors];
          });

          store.dispatch(loadFactors());
        });

        it('should be false after the factors are fetched', async () => {
          fakeAxios.onGet('/factors').reply(200, factors);

          await store.dispatch(loadFactors());

          expect(factorsSlice().loading).toBe(false);
        });

        it('should be false if the server returns an error', async () => {
          fakeAxios.onGet('/factors').reply(500);

          await store.dispatch(loadFactors());

          expect(factorsSlice().loading).toBe(false);
        });
      });
    });
  });

  it("should add the factor to the store if it's saved to the server", async () => {
    const factor = { id: 1 };
    const savedFactor = { ...factor, id: 2 };
    fakeAxios.onPost('/factors').reply(200, { data: savedFactor });

    await store.dispatch(addFactor(factor));

    expect(factorsSlice().list).toContainEqual(savedFactor);
  });

  it("should not add the factor to the store if it's not saved to the server", async () => {
    const factor = { id: 1 };
    fakeAxios.onPost('/factors').reply(500);

    await store.dispatch(addFactor(factor));

    expect(factorsSlice().list).toHaveLength(0);
  });

  describe('selectors', () => {
    it('selectFactors', () => {
      const state = createState();
      state.factors.list = [{ id: 1 }, { id: 2 }, { id: 3 }];

      const result = selectFactors(state);

      expect(result).toHaveLength(3);
    });
  });
});
