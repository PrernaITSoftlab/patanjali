export default function Logo({light=false}) {
  return (
    <a className={`logo ${light ? 'logo-light' : ''}`} href="/" aria-label="TrustLogix home">
      <span className="logo-mark" aria-hidden="true">
        <img src="/trustlogix-logo.png" alt="" />
      </span>
      <b><strong>Trust</strong>Logix</b>
    </a>
  );
}
