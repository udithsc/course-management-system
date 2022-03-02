import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { addChargeType, loadChargeTypes, selectChargeTypes } from '../chargeTypes';
import configureStore from '../configureStore';

const chargeTypes = {
  statusCode: null,
  data: [
    {
      id: 1,
      name: 'CHANNEL',
      type: 'Literal',
      chargeTypeValueList: [
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

describe('chargeTypesSlice', () => {
  let fakeAxios;
  let store;

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const chargeTypesSlice = () => store.getState().chargeTypes;

  const createState = () => ({
    chargeTypes: {
      list: []
    }
  });

  describe('loading chargeTypes', () => {
    // describe('if the chargeTypes exist in the cache', () => {
    //   it('they should not be fetched from the server again.', async () => {
    //     fakeAxios.onGet('/charge-type').reply(200, [{ id: 1 }]);

    //     await store.dispatch(loadChargeTypes());
    //     await store.dispatch(loadChargeTypes());

    //     expect(fakeAxios.history.get.length).toBe(1);
    //   });
    // });

    describe("if the chargeTypes don't exist in the cache", () => {
      it('they should be fetched from the server and put in the store', async () => {
        fakeAxios.onGet('/charge-type').reply(200, chargeTypes);

        await store.dispatch(loadChargeTypes());

        expect(chargeTypesSlice().list).toHaveLength(1);
      });

      describe('loading indicator', () => {
        it('should be true while fetching the chargeTypes', () => {
          fakeAxios.onGet('/charge-type').reply(() => {
            expect(chargeTypesSlice().loading).toBe(true);
            return [200, chargeTypes];
          });

          store.dispatch(loadChargeTypes());
        });

        it('should be false after the chargeTypes are fetched', async () => {
          fakeAxios.onGet('/charge-type').reply(200, chargeTypes);

          await store.dispatch(loadChargeTypes());

          expect(chargeTypesSlice().loading).toBe(false);
        });

        it('should be false if the server returns an error', async () => {
          fakeAxios.onGet('/charge-type').reply(500);

          await store.dispatch(loadChargeTypes());

          expect(chargeTypesSlice().loading).toBe(false);
        });
      });
    });
  });

  it("should add the chargeType to the store if it's saved to the server", async () => {
    const chargeType = { id: 1 };
    const savedChargeType = { ...chargeType, id: 2 };
    fakeAxios.onPost('/charge-type').reply(200, { data: savedChargeType });

    await store.dispatch(addChargeType(chargeType));

    expect(chargeTypesSlice().list).toContainEqual(savedChargeType);
  });

  it("should not add the chargeType to the store if it's not saved to the server", async () => {
    const chargeType = { id: 1 };
    fakeAxios.onPost('/charge-type').reply(500);

    await store.dispatch(addChargeType(chargeType));

    expect(chargeTypesSlice().list).toHaveLength(0);
  });

  describe('selectors', () => {
    it('selectChargeTypes', () => {
      const state = createState();
      state.chargeTypes.list = [{ id: 1 }, { id: 2 }, { id: 3 }];

      const result = selectChargeTypes(state);

      expect(result).toHaveLength(3);
    });
  });
});
