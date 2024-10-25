import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./ui/Home";
import Menu, { loader as menuLoader } from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import CreateOrder, {
  action as createOrderAction,
} from "./features/order/CreateOrder";
import Order, { loader as orderLoader } from "./features/order/Order";
import Error from "./ui/Error";
import AppLayout from "./ui/AppLayout";
import { action as updateOrderAction } from "./features/order/UpdateOrder";
// This is the function where we define all routes, we pass in an array of objects, each object is one route. and this is the new way in React Router 6.4 in order to enable data fetching or data loading with React Router. The traditional way we used in Worldwise still works in modern React Router but we cannot use it to load data or to submit data using forms.
const router = createBrowserRouter([
  {
    element: <AppLayout />, //the parent route of all other routes. Since it doesn't have a path, it's technically called in React Router as a layout route. (Thus, we are putting our routes onto some part of a component, via this component we can navigate to any route)
    errorElement: <Error />, // we can define on each of the routes, it's important to notice that each of these errors down there will bubble up to the parent route unless it is actually handled in the route itself.
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        errorElement: <Error />,
        loader: menuLoader, // This is step 2
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order/new",
        element: <CreateOrder />,
        action: createOrderAction,
        // So whenever there will be a Form submission in this route here(on this path), this action will be called.
      },
      {
        path: "/order/:orderId",
        element: <Order />,
        errorElement: <Error />,
        loader: orderLoader,
        action: updateOrderAction,
        //the form we want to be handled by action is inside UpdateOrder which is a child component of the child <Order/> but React Router is smart enough to know that so there will not be any problems.
      },
    ],
  },
  // We don't have to make a new one path as a fallback to the page not found in this modern way.
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

/* React Router Loaders
  The idea behind a loader is that somewhere in our code, we create a function that 
  fetches some data from an API.
  We then provide that loader function to one of our routes and that route will then 
  fetch that data as soon as the application goes to that route.
  At the end, once the data has arrived it will be provided to the page component itself
  using a custom hook(useLoaderData).

  [1] we create a loader.
  [2] we provide the loader to a route.
  [3] we provide the data to the page. (by useLoaderDate)

  Note! That data loader can be placed anywhere in our code base but the convention is
  to the place the loader for the data of a certain page inside the file of that page.
*/

/* React Router Actions
  While the loaders are used to read data, actions are used to write data or to mutate
  data. So a state that is stored on some server.
  Or in other words, actions allow us to manage this remote server state using action
  functions and Forms that we then wire up to routes similar to what we did with loaders.

  Note! Orders are made by sending a post request with the order data(user info + his cart) to the API
  and so, these actions and forms are ideal to create new orders.
*/
