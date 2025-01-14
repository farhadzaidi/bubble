function Welcome() {
  return (
    <div className="container">
      <section className="text-center">
        <h1 className="clear-margin">
          Welcome to <span className="primary">Bubble</span>
        </h1>
        <small>Private. Secure. Simple.</small>
      </section>
      <section className="text-center">
        <p>
          Bubble is a free and open-source messenger designed with security in
          mind.
        </p>
        <p>
          All messages are{" "}
          <span className="primary">end-to-end encrypted </span>
          and <span className="primary">disappear after 24 hours</span> to
          ensure your privacy.
        </p>
        <p>
          Create an account with just a username and password—no email, phone
          number, or personal info needed.
        </p>
      </section>
    </div>
  );
}

export default Welcome;
