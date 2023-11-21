import { type SerializeFrom } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import { type loader as rootLoader } from "~/routes/resources.root";

/**
 * @returns the request info from the root loader
 */
export function useRequestInfo() {
  const data = useRouteLoaderData("root") as SerializeFrom<typeof rootLoader>;
  return data.requestInfo;
}
type defaultPagination = { page?: number; perPage?: number };
export const getPaginationSearchParams = (
  request: Request,
  { page: defaultPage = 1, perPage: defaultPerPage = 6 }: defaultPagination
) => {
  const searchParams = new URL(request.url).searchParams;
  const page = Number(searchParams.get("page")) || defaultPage;
  const perPage = Number(searchParams.get("per_page")) || defaultPerPage;
  return { page, perPage };
};
