import React, { useRef, useState, useEffect, useMemo, JSX } from 'react';
import '../../images.d.ts';
import creditCard from '../../assets/credit-card.jpg';
import './Card.styles.scss';
import { toRefKey } from '../../utils/formatter.ts';
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { CardState } from '../../pages/Paycard/Paycard.page.tsx';

interface CardProps extends CardState {
    cardSide: string;
    focusSection: string;
    handleSetFocusSection: (section: string) => void;
    isInputFocused: boolean;
    handleSetIsInputFocused: (bool: boolean) => void;
}

const Card: React.FC<CardProps> = ({
    cardSide,
    handleSetFocusSection,
    focusSection,
    handleSetIsInputFocused,
    ...props
}) => {
    const [focusBoxStyle, setFocusBoxStyle] = useState({
        width: "100%",
        height: "100%",
        transform: "null"
    });

    const ccNumberRef = useRef(null) as unknown as React.RefObject<HTMLDivElement>;
    const ccNameRef = useRef(null) as unknown as React.RefObject<HTMLDivElement>;
    const ccExpRef = useRef(null) as unknown as React.RefObject<HTMLDivElement>;
    const ccCvcRef = useRef(null) as unknown as React.RefObject<HTMLDivElement>;

    type CardItemRefs = {
        [index: string]: React.RefObject<HTMLDivElement>;
    };

    const cardItemRefs: CardItemRefs = useMemo(
        () => ({
            ccNumberRef,
            ccNameRef,
            ccExpRef,
            ccCvcRef,
        }),
        [ccNumberRef, ccNameRef, ccExpRef, ccCvcRef]
    );

    useEffect(() => {
        if (!focusSection) return;

        const refKey = toRefKey(focusSection);
        const target = cardItemRefs[refKey].current;
        setFocusBoxStyle({
            width: `${target.offsetWidth}px`,
            height: `${target.offsetHeight}px`,
            transform: `translate(${target.offsetLeft}px, ${target.offsetTop}px)`,
        });
    }, [focusSection, cardItemRefs]);

    // 卡片號碼
    let cardNumberRow: Array<JSX.Element> = [];
    Array.from({ length: 19 }).forEach((_, idx) => {
        if ([4, 9, 14].includes(idx)) {
            cardNumberRow.push(
                <span className="card__card-number--space" key={`space-${idx}`}></span>
            );
        } else {
            cardNumberRow.push(
                <SwitchTransition key={`card-number-${idx}`}>
                    <CSSTransition
                        key={idx < props.cardNumber.length ? props.cardNumber[idx] : "#"}
                        classNames="slide-up"
                        addEndListener={(node, done) =>
                            node.addEventListener("transitionend", done, false)
                        }
                    >
                        <span>
                            {idx < props.cardNumber.length ? props.cardNumber[idx] : "#"}
                        </span>
                    </CSSTransition>
                </SwitchTransition>
            );
        }
    });

    let cardExpirationDate = "MM/YY";
    cardExpirationDate = cardExpirationDate.replace(
        /MM/,
        props.cardExpirationMonth || "MM"
    );
    cardExpirationDate = cardExpirationDate.replace(
        /YY/,
        props.cardExpirationYear || "YY"
    );

    return (
        <div className={`card ${cardSide === "back" && "card--is-flipped"}`}>

            <div className="card__front">
                <div
                    className={`card__focus-box ${!!focusSection && `card__focus-box--active`
                        }`}
                    style={focusBoxStyle}
                />
                <div className="card__background">
                    <img src={creditCard} alt="" />
                </div>
                <div className="card__wrapper">
                    <div
                        className="card__card-number"
                        onClick={() => {
                            handleSetFocusSection("cc-number")
                            handleSetIsInputFocused(true)
                        }}
                        ref={cardItemRefs.ccNumberRef}
                    >
                        {cardNumberRow}
                    </div>
                    <div className="card__content">
                        <div
                            className="card__card-holder"
                            onClick={() => {
                                handleSetFocusSection("cc-name")
                                handleSetIsInputFocused(true)
                            }}
                            ref={cardItemRefs.ccNameRef}
                        >
                            <div className="card__card-holder-title">Card Holder</div>
                            <div className="card__card-holder-name">
                                {props.cardHolder || "Full Name"}
                            </div>
                        </div>
                        <div
                            className="card__expires"
                            onClick={() => {
                                handleSetFocusSection("cc-exp")
                                handleSetIsInputFocused(true)
                            }}
                            ref={cardItemRefs.ccExpRef}
                        >
                            <div className="card__expires-title">Expires</div>
                            <div className="card__expires-date">{cardExpirationDate}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card__back">
                <div
                    className={`card__focus-box ${!!focusSection && `card__focus-box--active`
                        }`}
                    style={focusBoxStyle}
                />
                <div className="card__background">
                    <img src={creditCard} alt="" />
                </div>
                <div className="card__top">
                    <div className="card__black-line"></div>
                </div>
                <div className="card__card-cvc">
                    <div className="card__card-cvc-title">
                        <span ref={cardItemRefs.ccCvcRef}>{props.cardCVC || "CVC"}</span>
                    </div>
                    <div className="card__card-cvc-number"></div>
                </div>
            </div>

        </div>
    );
}

export default Card;