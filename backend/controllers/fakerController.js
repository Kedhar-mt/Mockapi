const { faker } = require('@faker-js/faker');

const getFakerLabels = (req, res) => {
  const fakerCategories = Object.keys(faker).reduce((acc, category) => {
    if (typeof faker[category] === 'object') {
      acc[category] = Object.keys(faker[category]).filter(method => typeof faker[category][method] === 'function');
    }
    return acc;
  }, {});

  const flatLabels = flattenObject(fakerCategories);


  //console.log("*********",flatLabels);
  res.json(flatLabels);
};


function flattenObject(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;
      if (Array.isArray(value)) {
        acc.push(...value.map(item => `${prefixedKey}.${item}`));
      } else if (typeof value === 'object' && value !== null) {
        acc.push(...flattenObject(value, prefixedKey));
      }
      return acc;
    }, []);
  }

module.exports = getFakerLabels;