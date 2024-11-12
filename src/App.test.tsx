import React from 'react';
import { render } from '@testing-library/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from 'App';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const renderWithRouter = (route = '/') => {
  const initialState = { output: 10 };
  const mockStore = configureStore();
  const store = mockStore(initialState);
  window.history.pushState({}, 'Test page', route);
  return {
    ...render(
      <Provider store={store}>
        <RouterProvider
          router={createBrowserRouter([{ path: '*', element: <App /> }])}
        />
      </Provider>
    )
  };
};

test('renders app page', () => {
  const screen = renderWithRouter();
  expect(screen.baseElement).toMatchSnapshot();
});
