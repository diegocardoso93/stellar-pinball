export default function typewriteText(ctx, target, text, delay = 50) {
  const length = text.length;
  let i = 0;
  ctx.time.addEvent({
    callback: () => {
      target.text += text[i];
      ++i;
    },
    repeat: length - 1,
    delay: delay,
  });
}
