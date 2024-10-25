import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";

// As soon as we clicked the Menu route a new fetch request will be fired off automatically because we connected the loader function to this page. This will implement a strategy called a "render as you fetch" so React Router will start fetching data at the same time as it starts rendering the correct route. so, these things actually happen in the same time, while what we did before using useEffect was always a "fetch on render" approach. which is to render the component first and then after the component was already rerendered is when we would start to fetch the data. this will then create so-called data loading waterfalls.
// So with this, React Router is no longer only responsible for matching component to urls in the browser but to also to provide the data that is nescessary for each page.
function Menu() {
  const menu = useLoaderData(); // Step 3, to get the loader data into this component we use useLoaderData custom hook. (we don't have to pass in any data into the function because React Router will automatically know that the data we want here is the one that is associated to this page which is comming from the loader provided in mune route)
  // console.log(menu);

  return (
    <ul className="divide-y divide-stone-200 px-2">
      {/*divide create a line between child elements*/}
      {menu.map((pizza) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  );
}

// the convention is to call the function 'loader' (Note! this is step 1)
export async function loader() {
  // this function needs to fetch the data and return it.
  const menu = await getMenu();
  return menu;
}
export default Menu;
