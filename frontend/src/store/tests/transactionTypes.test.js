import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  addTransactionType,
  loadTransactionTypes,
  selectTransactionTypes
} from '../transactionTypes';
import configureStore from '../configureStore';

const transactionTypes = {
  statusCode: null,
  data: [
    {
      id: 1,
      name: 'CHANNEL',
      type: 'Literal',
      transactionTypeValueList: [
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

describe('transactionTypesSlice', () => {
  let fakeAxios;
  let store;

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const transactionTypesSlice = () => store.getState().transactionTypes;

  const createState = () => ({
    transactionTypes: {
      list: []
    }
  });

  describe('loading transactionTypes', () => {
    // describe('if the transactionTypes exist in the cache', () => {
    //   it('they should not be fetched from the server again.', async () => {
    //     fakeAxios.onGet('/transaction-type').reply(200, [{ id: 1 }]);

    //     await store.dispatch(loadTransactionTypes());
    //     await store.dispatch(loadTransactionTypes());

    //     expect(fakeAxios.history.get.length).toBe(1);
    //   });
    // });

    describe("if the transactionTypes don't exist in the cache", () => {
      it('they should be fetched from the server and put in the store', async () => {
        fakeAxios.onGet('/transaction-type').reply(200, transactionTypes);

        await store.dispatch(loadTransactionTypes());

        expect(transactionTypesSlice().list).toHaveLength(1);
      });

      describe('loading indicator', () => {
        it('should be true while fetching the transactionTypes', () => {
          fakeAxios.onGet('/transaction-type').reply(() => {
            expect(transactionTypesSlice().loading).toBe(true);
            return [200, transactionTypes];
          });

          store.dispatch(loadTransactionTypes());
        });

        it('should be false after the transactionTypes are fetched', async () => {
          fakeAxios.onGet('/transaction-type').reply(200, transactionTypes);

          await store.dispatch(loadTransactionTypes());

          expect(transactionTypesSlice().loading).toBe(false);
        });

        it('should be false if the server returns an error', async () => {
          fakeAxios.onGet('/transaction-type').reply(500);

          await store.dispatch(loadTransactionTypes());

          expect(transactionTypesSlice().loading).toBe(false);
        });
      });
    });
  });

  it("should add the transactionType to the store if it's saved to the server", async () => {
    const transactionType = { id: 1 };
    const savedTransactionType = { ...transactionType, id: 2 };
    fakeAxios.onPost('/transaction-type').reply(200, { data: savedTransactionType });

    await store.dispatch(addTransactionType(transactionType));

    expect(transactionTypesSlice().list).toContainEqual(savedTransactionType);
  });

  it("should not add the transactionType to the store if it's not saved to the server", async () => {
    const transactionType = { id: 1 };
    fakeAxios.onPost('/transaction-type').reply(500);

    await store.dispatch(addTransactionType(transactionType));

    expect(transactionTypesSlice().list).toHaveLength(0);
  });

  describe('selectors', () => {
    it('selectTransactionTypes', () => {
      const state = createState();
      state.transactionTypes.list = [{ id: 1 }, { id: 2 }, { id: 3 }];

      const result = selectTransactionTypes(state);

      expect(result).toHaveLength(3);
    });
  });
});
