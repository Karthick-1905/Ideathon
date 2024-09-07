const FormInput = ({ labelText, labelFor, id, name, type, isRequired, placeholder, autoComplete , onChange ,value }) => {
  return (
      <div className="form-control w-full max-w-xs">
          <label htmlFor={labelFor} className="label">
              <span className="label-text">{labelText}</span>
          </label>
          <input
              id={id}
              name={name}
              type={type}
              required={isRequired}
              placeholder={placeholder}
              autoComplete={autoComplete}
              value={value}
              onChange={onChange}
              className={`input input-bordered w-full max-w-xs ${
                type === 'tel' ? 'hide-number-spinner' : ''
              }`}
          />
      </div>
  );
};

export default FormInput