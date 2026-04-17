import { Href, Link } from "expo-router";
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from "expo-web-browser";
import { type ComponentProps } from "react";

type EnlaceExternoProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: Href & string;
};

export function EnlaceExterno({ href, ...resto }: EnlaceExternoProps) {
  return (
    <Link
      target="_blank"
      {...resto}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== "web") {
          event.preventDefault();

          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}
