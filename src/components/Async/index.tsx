import { useEffect, useState } from 'react';

export function Async() {
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsButtonVisible(true);
    });
  }, []);

  return (
    <div>
      <div>Hello world</div>
      { isButtonVisible && <button>Button</button> }
    </div>
  );
}
