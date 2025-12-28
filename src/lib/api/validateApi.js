// Update the validateApi function to use the proxy
export async function validateApi(url, apiKey = null, apiKeyHeader = "X-Api-Key", apiKeyPrefix = "") {
  try {
    // Use the proxy endpoint instead of direct fetch
    const res = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        apiKey,
        apiKeyHeader,
        apiKeyPrefix,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP ${res.status}`);
    }

    const json = await res.json();

    const scalars = {};
    const arrays = {};
    const series = {};

    function isTimeSeriesObject(obj) {
      if (!obj || typeof obj !== 'object') return false;
      const keys = Object.keys(obj);
      if (keys.length === 0) return false;
      
      const dateKeys = keys.filter(k => 
        /^\d{4}-\d{2}-\d{2}/.test(k) ||
        /^\d{4}\/\d{2}\/\d{2}/.test(k) ||
        /^\d{2}-\d{2}-\d{4}/.test(k)
      );
      return dateKeys.length > 0 && dateKeys.length / keys.length > 0.7;
    }

    function walk(node, path = "") {
      if (node === null || node === undefined) return;

      if (Array.isArray(node)) {
        if (node.length && typeof node[0] === "object" && !Array.isArray(node[0])) {
          arrays[path] = node;
        }
        return;
      }

      if (typeof node === "object") {
        if (isTimeSeriesObject(node)) {
          series[path] = node;
          return;
        }

        Object.entries(node).forEach(([key, value]) => {
          const nextPath = path ? `${path}.${key}` : key;
          walk(value, nextPath);
        });
        return;
      }

      scalars[path] = node;
    }

    walk(json);

    const totalFields =
      Object.keys(scalars).length +
      Object.keys(arrays).length +
      Object.keys(series).length;

    return {
      ok: true,
      raw: json,
      scalars,
      arrays,
      series,
      totalFields,
      allPaths: getAllPaths(json),
    };
  } catch (err) {
    return {
      ok: false,
      error: { message: err?.message || "Failed to connect" },
    };
  }
}

// Keep readPath and getAllPaths functions as they are
export function readPath(obj, path) {
  if (!path || !obj) return undefined;
  
  if (Object.prototype.hasOwnProperty.call(obj, path)) {
    return obj[path];
  }
  
  if (!path.includes('.')) {
    return undefined;
  }
  
  const keys = path.split('.');
  let current = obj;
  let found = true;
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      found = false;
      break;
    }
    if (typeof current !== 'object') {
      found = false;
      break;
    }
    
    if (Object.prototype.hasOwnProperty.call(current, key)) {
      current = current[key];
    } else {
      found = false;
      break;
    }
  }
  
  if (found) return current;
  
  for (let i = 1; i < keys.length; i++) {
    const firstPart = keys.slice(0, i).join('.');
    const remaining = keys.slice(i);
    
    if (Object.prototype.hasOwnProperty.call(obj, firstPart)) {
      const remainingPath = remaining.join('.');
      return readPath(obj[firstPart], remainingPath);
    }
  }
  
  return undefined;
}

export function getAllPaths(obj, prefix = '', maxDepth = 5, currentDepth = 0) {
  const paths = [];
  
  if (currentDepth >= maxDepth) return paths;
  if (!obj || typeof obj !== 'object') return paths;
  if (Array.isArray(obj)) return paths;
  
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    paths.push(fullPath);
    
    if (value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0) {
      paths.push(...getAllPaths(value, fullPath, maxDepth, currentDepth + 1));
    }
  }
  
  return paths;
}
