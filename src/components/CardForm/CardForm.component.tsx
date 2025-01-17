import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import './CardForm.styles.scss';
import { ReducerAction, CardState } from '../../pages/Paycard/Paycard.page';
import { toRefKey } from '../../utils/formatter';

const CardForm = () => {
    return (
        <form className='card-form'>
            <div className="form-group card-form__cc-number">
                <label htmlFor="card-number">Card Number</label>
                <input type="text" id="card-number" name="card-number" />
            </div>
            <div className="form-group card-form__cc-name">
                <label htmlFor="card-name">Card Holder</label>
                <input type="text" id="card-name" name="card-name" />
            </div>
            <div className="form-group row">
                <div className="form-group card-form__cc-exp">
                    <label htmlFor="card-name">Expiration Date</label>
                    <div className='row'>
                        <select
                            name="card-expiration-month"
                            id="card-expiration-month"
                            defaultValue='Month'
                        >
                            <option disabled>Month</option>
                        </select>
                        <select
                            name="card-expiration-year"
                            id="card-expiration-year"
                            defaultValue='Year'
                        >
                            <option disabled>Year</option>
                        </select>
                    </div>
                </div>
                <div className="form-group card-form__cc-cvc">
                    <label htmlFor="card-cvc">CVC</label>
                    <input type="text" id="card-cvc" name="card-cvc" maxLength={3} />
                </div>
            </div>

            <button type='submit' className="card-form__submit-btn">Submit</button>
        </form>
    );
}

export default CardForm;