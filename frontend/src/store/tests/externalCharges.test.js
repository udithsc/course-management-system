import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { addExternalCharge, loadExternalCharges, selectExternalCharges } from '../externalCharges';
import configureStore from '../configureStore';

const externalCharges = {
  statusCode: null,
  data: [
    {
      id: 1,
      name: 'CHANNEL',
      type: 'Literal',
      externalChargeValueList: [
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

describe('externalChargesSlice', () => {
  let fakeAxios;
  let store;

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const externalChargesSlice = () => store.getState().externalCharges;

  const createState = () => ({
    externalCharges: {
      list: []
    }
  });

  describe('loading externalCharges', () => {
    // describe('if the externalCharges exist in the cache', () => {
    //   it('they should not be fetched from the server again.', async () => {
    //     fakeAxios.onGet('/external-charge').reply(200, [{ id: 1 }]);

    //     await store.dispatch(loadExternalCharges());
    //     await store.dispatch(loadExternalCharges());

    //     expect(fakeAxios.history.get.length).toBe(1);
    //   });
    // });

    describe("if the externalCharges don't exist in the cache", () => {
      it('they should be fetched from the server and put in the store', async () => {
        fakeAxios.onGet('/external-charge').reply(200, externalCharges);

        await store.dispatch(loadExternalCharges());

        expect(externalChargesSlice().list).toHaveLength(1);
      });

      describe('loading indicator', () => {
        it('should be true while fetching the externalCharges', () => {
          fakeAxios.onGet('/external-charge').reply(() => {
            expect(externalChargesSlice().loading).toBe(true);
            return [200, externalCharges];
          });

          store.dispatch(loadExternalCharges());
        });

        it('should be false after the externalCharges are fetched', async () => {
          fakeAxios.onGet('/external-charge').reply(200, externalCharges);

          await store.dispatch(loadExternalCharges());

          expect(externalChargesSlice().loading).toBe(false);
        });

        it('should be false if the server returns an error', async () => {
          fakeAxios.onGet('/external-charge').reply(500);

          await store.dispatch(loadExternalCharges());

          expect(externalChargesSlice().loading).toBe(false);
        });
      });
    });
  });

  it("should add the externalCharge to the store if it's saved to the server", async () => {
    const externalCharge = { id: 1 };
    const savedExternalCharge = { ...externalCharge, id: 2 };
    fakeAxios.onPost('/external-charge').reply(200, { data: savedExternalCharge });

    await store.dispatch(addExternalCharge(externalCharge));

    expect(externalChargesSlice().list).toContainEqual(savedExternalCharge);
  });

  it("should not add the externalCharge to the store if it's not saved to the server", async () => {
    const externalCharge = { id: 1 };
    fakeAxios.onPost('/external-charge').reply(500);

    await store.dispatch(addExternalCharge(externalCharge));

    expect(externalChargesSlice().list).toHaveLength(0);
  });

  describe('selectors', () => {
    it('selectExternalCharges', () => {
      const state = createState();
      state.externalCharges.list = [{ id: 1 }, { id: 2 }, { id: 3 }];

      const result = selectExternalCharges(state);

      expect(result).toHaveLength(3);
    });
  });
});
