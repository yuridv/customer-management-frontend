const Directory = (files, directory) => {
  if (!directory) return { path: '', files: {} };

  let path = directory.toLowerCase().replaceAll('../', '').replaceAll('./', '');
  if (path.startsWith('/')) path = path.replace('/', '');
  if (path.endsWith('/')) path = path.slice(0, -1);

  let result = {};
  for (const file of Object.keys(files)) {
    const name = file
      .toLowerCase()
      .replace('../../' + path + '/', '')
      .split('.')[0];

    result[name] = files[file];
  }

  result = Object.fromEntries(
    Object.entries(result)
      .sort((a, b) => {
        // Ordena pelo que tem menos barras (/)
        const depthA = a[0].split('/').length;
        const depthB = b[0].split('/').length;
        if (depthA !== depthB) return depthA - depthB;
    
        // Prioriza os que terminal com main
        const endsWithMainA = a[0].toLowerCase().endsWith('main');
        const endsWithMainB = b[0].toLowerCase().endsWith('main');
        return (endsWithMainB ? 1 : 0) - (endsWithMainA ? 1 : 0);
      })
  );

  return result;
};

export default Directory;