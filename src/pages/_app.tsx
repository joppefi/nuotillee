import { SelectionProvider } from "@/components/SelectedContext";
import { ChakraProvider, theme } from "@chakra-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <SelectionProvider>
        <Component {...pageProps} />
      </SelectionProvider>
    </ChakraProvider>
  );
}
