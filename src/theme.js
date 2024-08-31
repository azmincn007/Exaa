import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  styles: {
    global: {
      // This will allow Tailwind classes to work within Chakra components
      '.chakra-modal__content-container': {
        isolation: 'auto',
      },
    },
  },
})

export default theme