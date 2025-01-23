import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import './CardForm.styles.scss';
import { ReducerAction, CardState } from '../../pages/Paycard/Paycard.page';
import { toRefKey } from '../../utils/formatter.ts';

interface CardFormProps extends CardState {
    handleRotateCard: (side: string) => void;
    handleSetFocusSection: (section: string) => void;
    dispatch: React.Dispatch<ReducerAction>;
    isInputFocused: boolean;
    handleSetIsInputFocused: (bool: boolean) => void;
    focusSection: string;
}

const CardForm: React.FC<CardFormProps> = ({
    handleRotateCard,
    handleSetFocusSection,
    dispatch,
    isInputFocused,
    handleSetIsInputFocused,
    focusSection,
    ...props
}) => {
    const isInputFocusedRef = useRef(isInputFocused);
    isInputFocusedRef.current = isInputFocused;

    const ccNumberRef = useRef(null) as unknown as React.RefObject<HTMLInputElement>;
    const ccNameRef = useRef(null) as unknown as React.RefObject<HTMLInputElement>;
    const ccExpMonthRef = useRef(null) as unknown as React.RefObject<HTMLSelectElement>;
    const ccExpYearRef = useRef(null) as unknown as React.RefObject<HTMLSelectElement>;
    const ccCvcRef = useRef(null) as unknown as React.RefObject<HTMLInputElement>;

    type InputRefs = {
        [index: string]: React.RefObject<HTMLInputElement | HTMLSelectElement>;
    };

    const inputRefs: InputRefs = useMemo(
        () => ({
            ccNumberRef,
            ccNameRef,
            ccExpMonthRef,
            ccExpYearRef,
            ccCvcRef,
        }),
        [ccNumberRef, ccNameRef, ccExpMonthRef, ccExpYearRef, ccCvcRef]
    );

    const setInputRefFocus = useCallback(
        (focusSection: string) => {
            if (!focusSection) return;
            let key = toRefKey(focusSection);
            if (key === "ccExpRef") {
                key = "ccExpMonthRef";
            }
            inputRefs[key]?.current.focus();
        },
        [inputRefs]
    );

    const handleUpdateCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const re = /^(\d{0,4}\s?){0,4}$/;

        const newCardNumber = e.target.value.replace(/\s/g, "");
        let cardNumber = "";

        for (let i = 0; i < newCardNumber.length; i++) {
            cardNumber += newCardNumber.charAt(i);
            if ([3, 7, 11].includes(i)) {
                cardNumber += " ";
            }
        }
        cardNumber = cardNumber.trim();
        if (newCardNumber === "" || re.test(newCardNumber)) {
            dispatch({ type: "updateCardNumber", payload: cardNumber });
        }
    };

    const handleUpdateCardCVC = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const re = /^\d+$/;
        if (newValue === "" || re.test(newValue)) {
            dispatch({ type: "updateCardCVC", payload: e.target.value });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    useEffect(() => {
        setInputRefFocus(focusSection);
    }, [focusSection, setInputRefFocus]);

    const handleInputBlur = () => {
        setTimeout(() => {
            if (!isInputFocusedRef.current) {
                handleSetFocusSection("");
            }
        }, 300);
        handleSetIsInputFocused(false);
    };


    return (
        <form className='card-form' onSubmit={handleSubmit}>
            <div className="form-group card-form__cc-number">
                <label htmlFor="card-number">Card Number</label>
                <input
                    type="text"
                    id="card-number"
                    name="card-number"
                    autoComplete='off'
                    maxLength={19}
                    value={props.cardNumber}
                    onChange={handleUpdateCardNumber}
                    onFocus={() => {
                        handleSetFocusSection("cc-number")
                        handleSetIsInputFocused(true);
                        handleRotateCard("front");
                    }}
                    onBlur={handleInputBlur}
                    ref={inputRefs.ccNumberRef as React.RefObject<HTMLInputElement>}
                    autoFocus
                />
            </div>
            <div className="form-group card-form__cc-name">
                <label htmlFor="card-holder">Card Holder</label>
                <input
                    type="text"
                    id="card-holder"
                    name="card-holder"
                    autoComplete='off'
                    maxLength={30}
                    value={props.cardHolder}
                    onChange={(e) => dispatch({ type: "updateCardHolder", payload: e.target.value })}
                    onFocus={() => {
                        handleSetFocusSection("cc-name");
                        handleSetIsInputFocused(true);
                        handleRotateCard("front");
                    }}
                    onBlur={handleInputBlur}
                    autoFocus={focusSection === "cc-name"}
                    ref={inputRefs.ccNameRef as React.RefObject<HTMLInputElement>}
                />
            </div>
            <div className="form-group row">
                <div className="form-group card-form__cc-exp">
                    <label htmlFor="card-name">Expiration Date</label>
                    <div className='row'>
                        <select
                            name="card-expiration-month"
                            id="card-expiration-month"
                            defaultValue='Month'
                            onChange={(e) => dispatch({ type: "updateCardExpirationMonth", payload: e.target.value })}
                            onFocus={() => {
                                handleSetFocusSection("cc-exp");
                                handleSetIsInputFocused(true);
                                handleRotateCard("front");
                            }}
                            onBlur={handleInputBlur}
                            ref={inputRefs.ccExpMonthRef as React.RefObject<HTMLSelectElement>}
                        >
                            <option disabled>Month</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                <option key={month} value={("0" + month).slice(-2)}>{month}</option>
                            ))}
                        </select>
                        <select
                            name="card-expiration-year"
                            id="card-expiration-year"
                            defaultValue='Year'
                            onChange={(e) => dispatch({ type: "updateCardExpirationYear", payload: e.target.value })}
                            onFocus={() => {
                                handleSetFocusSection("cc-exp");
                                handleSetIsInputFocused(true);
                                handleRotateCard("front");
                            }}
                            onBlur={handleInputBlur}
                            ref={inputRefs.ccExpYearRef as React.RefObject<HTMLSelectElement>}
                        >
                            <option disabled>Year</option>
                            {Array.from({ length: 12 }).map((_, idx) => (
                                <option key={idx}>{2025 + idx}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-group card-form__cc-cvc">
                    <label htmlFor="card-cvc">CVC</label>
                    <input
                        type="text"
                        id="card-cvc"
                        name="card-cvc"
                        maxLength={3}
                        value={props.cardCVC}
                        onChange={handleUpdateCardCVC}
                        onFocus={() => {
                            handleSetFocusSection("cc-cvc");
                            handleSetIsInputFocused(true);
                            handleRotateCard("back");
                        }}
                        onBlur={handleInputBlur}
                        ref={inputRefs.ccCvcRef as React.RefObject<HTMLInputElement>}
                    />
                </div>
            </div>

            <button type='submit' className="card-form__submit-btn">Submit</button>
        </form>
    );
}

export default CardForm;