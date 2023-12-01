export default ({ config }) => {
  const extra = {
    ...config.extra,
    weatherAPI: '604a4eee84b9e0fd136efb915c972163',
    revGeoAPI: '8a67078ab41c42b89f3b315f92d3594f',
    eas: {
      projectId: '2be74524-ee3a-4259-b002-fd31d2c4e469',
    },
  };

  return {
    name: 'FC Weather',
    ...config,
    extra,
  };
};
