
export const findKeyInObject = (obj: any, keyToFind: string): any => {
    if (typeof obj !== 'object' || obj === null) {
      return null;
    }

    if (obj.hasOwnProperty(keyToFind)) {
      return obj[keyToFind];
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const result = findKeyInObject(obj[key], keyToFind);
        if (result !== null) {
          return result;
        }
      }
    }
    return null;
  };