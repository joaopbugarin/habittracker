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
      main: 'bg-orange-500',
      hover: 'hover:bg-orange-600',
      text: 'text-orange-500',
    },
    background: {
      main: 'bg-gray-100',
      card: 'bg-white',
    },
    text: {
      primary: 'text-orange-600',      // Changed from emerald
      secondary: 'text-emerald-500',   // Changed to emerald
      muted: 'text-gray-400',
    },
    border: {
      main: 'border-gray-200',
    },
  },
  components: {
    button: {
      primary: 'px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors',
      secondary: 'px-4 py-2 text-sm text-emerald-500 hover:bg-emerald-50 rounded-md', // Fixed text color
    },
    input: 'mt-1 block w-full rounded-md border border-gray-200 p-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500',
    card: 'bg-white rounded-lg shadow-sm p-8 border border-gray-200',
    modal: 'fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm'
  },
  gradients: {
    background: 'bg-gradient-to-br from-orange-500 via-orange-600 to-emerald-700',
    text: 'bg-gradient-to-r from-orange-500 to-emerald-600',
  },
  effects: {
    shadow: 'shadow-lg',
    transition: 'transition-all duration-200',
  }
  }