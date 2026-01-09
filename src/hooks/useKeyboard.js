import { useState, useEffect, useCallback } from 'react';

export const useKeyboard = () => {
  const [keys, setKeys] = useState({});

  const handleKeyDown = useCallback((event) => {
    setKeys((prev) => ({ ...prev, [event.key]: true }));
  }, []);

  const handleKeyUp = useCallback((event) => {
    setKeys((prev) => ({ ...prev, [event.key]: false }));
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const isKeyPressed = useCallback(
    (key) => {
      return keys[key] || false;
    },
    [keys]
  );

  const isLeftPressed = useCallback(() => {
    return keys['ArrowLeft'] || keys['a'] || keys['A'];
  }, [keys]);

  const isRightPressed = useCallback(() => {
    return keys['ArrowRight'] || keys['d'] || keys['D'];
  }, [keys]);

  const isSpacePressed = useCallback(() => {
    return keys[' '];
  }, [keys]);

  const isPausePressed = useCallback(() => {
    return keys['p'] || keys['P'] || keys['Escape'];
  }, [keys]);

  const isEnterPressed = useCallback(() => {
    return keys['Enter'];
  }, [keys]);

  return {
    keys,
    isKeyPressed,
    isLeftPressed,
    isRightPressed,
    isSpacePressed,
    isPausePressed,
    isEnterPressed,
  };
};

export default useKeyboard;
