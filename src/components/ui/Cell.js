import "styles/ui/Cell.scss";

export const Cell = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`cell-button ${props.className}`}>
        {props.children}
    </button>
);
