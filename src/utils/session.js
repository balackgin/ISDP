/**
 * opts.isCopy   => Object.assign
 * opts.isClear => localStorage.clear()
 * opts.isDel => localStorage.removeItem
 *
 */
export function storage(key, val, opts = {}) {
  const { isCopy, isClear, isDel, isSession } = opts,
    session = isSession ? sessionStorage : localStorage;
  if (isClear || isDel) {
    isClear && session.clear();
    isDel && session.removeItem(key);
    return true;
  }
  if (val) {
    let obj = val;
    if (isCopy && typeof val === 'object') {
      let oldSession = session.getItem(key);
      try {
        oldSession = oldSession && JSON.parse(oldSession);
      } catch (error) {
        oldSession = null;
      }
      obj = (oldSession && Object.assign(oldSession, val)) || val;
    }
    session.setItem(
      key,
      (typeof obj === 'object' && JSON.stringify(obj)) || obj
    );
  } else {
    let val = session.getItem(key);
    try {
      val = JSON.parse(val);
    } catch (error) {
      1;
    }
    return val;
  }
}
