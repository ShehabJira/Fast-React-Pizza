import Header from "./Header";
import Loader from "./Loader";
import CartOverview from "../features/cart/CartOverview";
import { Outlet, useNavigation } from "react-router-dom";
function AppLayout() {
  const navigation = useNavigation(); // will give information whether the application is currently idle, loading, or submitting. (this information is for the entire application not just for one page but for the entire router, so if one of these pages here is loading, then the navigation state will become loading no matter which of these pages is actually being loaded.) In turn, we will put a big loader here to work for all of them.
  const isLoading = navigation.state === "loading";
  // console.log(navigation);

  return (
    <div className=" grid h-screen grid-rows-[auto_1fr_auto]">
      {isLoading && <Loader />}

      <Header />

      <div className="overflow-auto">
        <main className="mx-auto max-w-3xl">
          <Outlet />
          {/* Here all the routes are put, this will be the changing part*/}
        </main>
      </div>

      <CartOverview />
    </div>
  );
}

export default AppLayout;
