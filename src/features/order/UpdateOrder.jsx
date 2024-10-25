import { useFetcher } from "react-router-dom";
import Button from "../../ui/Button";
import { updateOrder } from "../../services/apiRestaurant";
function UpdateOrder({ order }) {
  const fetcher = useFetcher();
  // in order to update(write) data, we use fetcher.Form component instead of fetcher.load
  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Make priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;
// fetcher.Form is just like the React Router Form but the only difference is submitting
// in React Router Form creates a new navigation(navigates away from the current page)
// while fetcher.Form will NOT navigate away, it will submit and revalidate the page.
// revalidation means that React Router know that the data has changed as a result of some action, so then when that happens it will automatically re-fetch the data in the background and rerender the page with that new data

export async function action({ request, params }) {
  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}
// we need to wire up this action with its route
