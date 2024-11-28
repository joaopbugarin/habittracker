interface Theme {
  colors: {
    primary: {
      main: string;
      hover: string;
      text: string;
    };
    background: {
      main: string;
      card: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: {
      main: string;
    };
  };
  components: {
    button: {
      primary: string;
      secondary: string;
    };
    input: string;
    card: string;
    modal: string;
  };
  gradients: {
    background: string;
    text: string;
  };
  effects: {
    shadow: string;
    transition: string;
  };
  }

  export const theme: Theme = {
  colors: {
    primary: {
      main: 'bg-purple-600',
      hover: 'hover:bg-purple-700',
      text: 'text-purple-600',
    },
    background: {
      main: 'bg-gray-100',
      card: 'bg-white',
    },
    text: {
      primary: 'text-gray-800',
      secondary: 'text-gray-700',
      muted: 'text-gray-500',
    },
    border: {
      main: 'border-gray-300',
    },
  },
  components: {
    button: {
      primary: 'px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors',
      secondary: 'px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md',
    },
    input: 'mt-1 block w-full rounded-md border border-gray-300 p-2',
    card: 'bg-white rounded-lg shadow-sm p-6',
    modal: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'
  },
  gradients: {
    background: 'bg-gradient-to-br from-purple-700 via-purple-800 to-gray-900',
    text: 'bg-gradient-to-r from-purple-600 to-purple-900',
  },
  effects: {
    shadow: 'shadow-2xl',
    transition: 'transition-all duration-200',
  }
}