export const getConfigParse = async (index: number) => {
  switch (index) {
    case 0: {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    case 1: {
      return [1, 0, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    case 2: {
      return [2, 0, 3, 1, 4, 5, 6, 7, 8, 9];
    }
    case 3: {
      return [3, 2, 4, 1, 5, 0, 6, 7, 8, 9];
    }
    case 4: {
      return [4, 3, 5, 2, 6, 1, 7, 0, 8, 9];
    }
    case 5: {
      return [5, 4, 6, 3, 7, 2, 8, 1, 9, 0];
    }
    case 6: {
      return [6, 5, 7, 4, 8, 3, 9, 2, 1, 0];
    }
    case 7: {
      return [7, 6, 8, 5, 9, 4, 3, 2, 1, 0];
    }
    case 8: {
      return [8, 7, 9, 6, 5, 4, 3, 2, 1, 0];
    }
    case 9: {
      return [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    }
  }
};
