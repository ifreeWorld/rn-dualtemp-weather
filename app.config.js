export default ({ config }) => {
  const extra = {
    ...config.extra,
    weatherAPI: '604a4eee84b9e0fd136efb915c972163',
    revGeoAPI: '8a67078ab41c42b89f3b315f92d3594f',
    eas: {
      projectId: '754ff626-feae-4ae7-b026-4a2f8414b8a0',
    },
  };

  return {
    name: 'Fahrenheit Celsius Weather',
    ...config,
    extra,
  };
};
