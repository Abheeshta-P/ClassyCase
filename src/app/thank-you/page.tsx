import { Suspense } from "react";
import ThankYou from "./ThankYou";
import { Loading } from "../Loading";

const Page = () => {
  return (
    <Suspense fallback = {<Loading/>}>
      <ThankYou />
    </Suspense>
  );
};

export default Page;
