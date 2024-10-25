// Here we will create a Form and create an action
// when we submit a new order we want to submit the user data + the selected pizzas
// which are stored in the cart
import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store.js";
import { clearCart } from "../cart/cartSlice";
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice.js";
// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: "Mediterranean",
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: "Vegetale",
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: "Spinach and Mushroom",
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const cart = useSelector(getCart);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData(); // as this component is wired up with action, we can get the action data as we do in loader. but the most use case is just like this usage of errors.
  const {
    username,
    address,
    position,
    status: addressStatus,
    error: errorAddress,
  } = useSelector((store) => store.user);
  const isLoadingAddress = addressStatus === "loading";
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;
  const dispatch = useDispatch();

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/* To make this form react nicely with React Router, we need to replace this with a Form component that React Router gives us */}
      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        {/* We are doing a POST request to create a new order, we could also use in this Form component PATCH and DELETE but not GET, as actions write don't read*/}
        {/* We could specify the action where we could then write the path that this form should be submitted to, but this is will not be necessary, because by default, React Router will match to the closest route, but if you left action with the path it also will work */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            defaultValue={username}
            type="text"
            name="customer"
            required
            className="input grow"
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" required className="input w-full" />
            {/*React Router encourages to use 'required' whenver possible to prevent submitting empty fields*/}
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              required
              className="input w-full"
              disabled={isLoadingAddress}
              defaultValue={address}
            />
            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className="absolute right-[3px] top-[3px] z-50 md:right-[5px] md:top-[5px]">
              <Button
                type="small"
                disabled={isLoadingAddress}
                onClick={(e) => {
                  e.preventDefault(); // because this is a btn inside a form, if it clicked it will submit the form.
                  dispatch(fetchAddress());
                }}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring  focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          {/* There is a nice way of getting some data into the action without it being a form field, so we can do a hidden input */}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          {/* cart is an object and here we can only have strings */}
          <input
            type="hidden"
            name="position"
            value={
              position.latitude
                ? `${position.latitude},${position.longitude}`
                : ""
            }
          />
          <Button disabled={isSubmitting || isLoadingAddress} type="primary">
            {isSubmitting
              ? `Placing order...`
              : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// as a convention, we just call it action
export async function action({ request }) {
  // As soon as we submit that special Form, it will then create a request that will be intercepted by this action function as soon as we have it connected with React Router (with the route we want).
  // whenever that special Form is submitted, React Router will then call this action function and it will pass in the request that was submitted. So then, from here we can accept it.
  const formData = await request.formData(); // formData() is just a regular web API provided by the browser.
  const data = Object.fromEntries(formData); // we need to return an object from formData. Object.fromEntries() Returns an object created by key-value entries for properties and methods. Note! Object.entries() => Returns an 'array' of key/values of the enumerable properties of an object

  const order = {
    ...data,
    cart: JSON.parse(data.cart), // return it back to object
    priority: data.priority === "true",
  };

  // handling errors that might be exist in the form.
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you.";
  if (Object.keys(errors).length > 0) return errors;
  console.log(order);
  // If everything is ok, create new order and redirect.
  // So we have the data now in the shape that we want it to be, and now we can use it to create a new order. and submit it with a POST requst.
  const newOrder = await createOrder(order);

  // after creating the order we want to empty the cart, but we cannot use useDispatch(clearCart()), as we cannot use hooks in a function, but there is a hack we could make which is to bring the whole store in here and dispatch the action directly. Note! don't overuse this technique because it deactivates some performance optimizaitons of Redux on this page.
  store.dispatch(clearCart()); // DO NOT OVERUSE!

  // we want now to immediately redirect the page to the order/Id  to show all the information about that new order. but we cannot make this with useNavigate as it's a hook. so we will use redirect() function instead which will create a new response, and this is also provided to us by React Router.
  return redirect(`/order/${newOrder.id}`);
  // as a final step we need to connect this two (the Form and action function) so we need to go to our route and then connect this action to the route.
}

export default CreateOrder;
// Note that we did all that without writing any boilerplate code that we used to write earlier, where we had to create state variables for all these inputs, then we had to handle the request and preventDefault and all that stuff. So using action funciton and Form we don't have to do all these stuff.
