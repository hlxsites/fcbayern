const decorate = () => {
  document.querySelectorAll('.liveticker main .section p').forEach((p) => {
    const test = /^\d?\d'/.exec(p.textContent);
    if (test && test.length > 0) {
      // const time = test[0];
    }
  });
};

decorate();
