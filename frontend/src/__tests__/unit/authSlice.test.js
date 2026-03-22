import { describe, it, expect, beforeEach, vi } from 'vitest';
import configureStore from '../../store/configureStore';
import { 
  loggedOut, 
  loggedIn, 
  selectUser,
  selectIsAdmin,
  selectIsInstructor,
  selectIsStudent
} from '../../store/auth';

// Mock jwtDecode since we're testing the slice with a fake token
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn((token) => {
    return JSON.parse(token); // Our tests will just send stringified JSON as token
  })
}));

describe('auth slice', () => {
  let store;

  beforeEach(() => {
    store = configureStore();
  });

  describe('reducers', () => {
    it('handles loggedIn', () => {
      const decodedInfo = {
        id: '123',
        name: 'Test',
        email: 'test@example.com',
        role: 'ADMIN',
      };
      
      store.dispatch(loggedIn({ accessToken: JSON.stringify(decodedInfo) }));
      
      const state = store.getState().auth;
      expect(state.user).toMatchObject({ role: 'ADMIN', email: 'test@example.com' });
      expect(state.isLoading).toBe(false);
    });

    it('handles loggedOut', () => {
      store.dispatch(loggedIn({ accessToken: JSON.stringify({ role: 'STUDENT' }) }));
      store.dispatch(loggedOut());
      
      const state = store.getState().auth;
      expect(state.user).toEqual({});
      expect(state.isLoading).toBe(false);
    });
  });

  describe('selectors', () => {
    it('identifies an ADMIN', () => {
      store.dispatch(loggedIn({ accessToken: JSON.stringify({ role: 'ADMIN' }) }));
      const state = store.getState();
      
      expect(selectUser(state)).toBeDefined();
      expect(selectIsAdmin(state)).toBe(true);
      expect(selectIsInstructor(state)).toBe(true); // Admin has instructor privileges
      expect(selectIsStudent(state)).toBe(false);
    });

    it('identifies an INSTRUCTOR', () => {
      store.dispatch(loggedIn({ accessToken: JSON.stringify({ role: 'INSTRUCTOR' }) }));
      const state = store.getState();
      
      expect(selectIsAdmin(state)).toBe(false);
      expect(selectIsInstructor(state)).toBe(true);
      expect(selectIsStudent(state)).toBe(false);
    });

    it('identifies a STUDENT', () => {
      store.dispatch(loggedIn({ accessToken: JSON.stringify({ role: 'STUDENT' }) }));
      const state = store.getState();
      
      expect(selectIsAdmin(state)).toBe(false);
      expect(selectIsInstructor(state)).toBe(false);
      expect(selectIsStudent(state)).toBe(true);
    });

    it('identifies missing user as false for all roles', () => {
      const state = store.getState();
      
      // empty object is standard when no jwt is set
      expect(selectUser(state)).toEqual({});
      expect(selectIsAdmin(state)).toBe(false);
      expect(selectIsInstructor(state)).toBe(false);
      expect(selectIsStudent(state)).toBe(false);
    });
  });
});


