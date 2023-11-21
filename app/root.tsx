import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import Layout from "./layout";
import stylesheet from "~/tailwind.css";
import { type LinksFunction } from "@remix-run/node";
import MUIThemeProvider from "./config/themeMui";
import { loader } from "./routes/resources.root";

export { loader };
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];
export default function App() {
  const data = useLoaderData<typeof loader>()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={
          "h-screen w-full overflow-auto bg-background text-foreground"
        }
      >
        <MUIThemeProvider>
          <Layout />
        </MUIThemeProvider>
        <script
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(data.ENV)}`,
					}}
				/>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
