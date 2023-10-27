import React from "react";
import { SelectionProvider } from "@/components/SelectedContext";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import theme from "@/styles/theme";

// Fix useLayoutEffect does nothing on the server https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85?permalink_comment_id=3886909#gistcomment-3886909
if (typeof window === "undefined") React.useLayoutEffect = React.useEffect;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <SelectionProvider>
        <Component {...pageProps} />
      </SelectionProvider>
    </ChakraProvider>
  );
}
