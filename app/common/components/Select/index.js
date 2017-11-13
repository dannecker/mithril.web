import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import withStyles from 'nebo15-isomorphic-style-loader/lib/withStyles';

import Icon from '@components/Icon';
import OuterClick from '@components/OuterClick';

import styles from './styles.scss';

const LIST_HEIGHT_PADDING = 32;

class Select extends React.Component {
  static propTypes = {
    active: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    labelText: PropTypes.string,
    open: PropTypes.bool,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
        name: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
        disabled: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
      })
    ).isRequired,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    open: false,
    multiple: false,
  };

  state = {
    open: this.props.open,
    active: [],
  };

  componentWillMount() {
    this.props.active && this.setState({ active: [this.props.active] });
  }

  onSelect(name) {
    if (this.props.multiple) {
      const active = Array.isArray(this.state.active) ? this.state.active : [];

      if (active.includes(name)) {
        active.splice(active.indexOf(name), 1);
      } else {
        active.push(name);
      }

      this.setState({ active, open: false });

      this.props.onChange && this.props.onChange(active);

      return;
    }

    this.setState({ active: [name], open: false });
    this.props.onChange && this.props.onChange(name);
  }

  /**
   * Calculate open drop down popup position
   * @returns {String<'top'|'bottom'>}
   */
  get position() {
    if (!this.selectNode) {
      return 'bottom';
    }

    const selectSize = this.selectNode.getBoundingClientRect();
    const screenHeight = document.documentElement.clientHeight;
    const selectHeight = this.listNode.clientHeight;

    if (screenHeight - selectSize.bottom > selectHeight + LIST_HEIGHT_PADDING) {
      return 'bottom';
    }

    return 'top';
  }

  get value() {
    return this.state.active;
  }

  /* eslint-disable jsx-a11y/no-static-element-interactions */
  render() {
    const {
      options = [],
      placeholder,
      disabled,
      labelText,
      multiple,
    } = this.props;

    const activeItem = this.state.active || [];
    const classNames = classnames(
      styles.select,
      this.state.open && styles[this.position],
      this.state.open && styles.open,
      disabled && styles.disabled,
      multiple && styles.multiple
    );

    return (
      <OuterClick onClick={() => this.setState({ open: false })}>
        <section ref={ref => (this.selectNode = ref)} className={classNames}>
          {labelText && <div className={styles.label}>{labelText}</div>}
          <div
            onClick={() => this.setState({ open: !this.state.open })}
            className={styles.control}
          >
            {multiple || (
              <div>
                <span hidden={activeItem.length} className={styles.placeholder}>
                  {placeholder}
                </span>
                {activeItem.length ? (
                  <span hidden={!activeItem.length}>
                    {
                      options.filter(({ name }) => name === activeItem[0])[0]
                        .title
                    }
                  </span>
                ) : null}
              </div>
            )}
            {multiple && (
              <div>
                {activeItem.length ? (
                  <ul className={styles['multiple-list']}>
                    {activeItem.map(name => (
                      <li key={`${name}-key`}>{name}</li>
                    ))}
                  </ul>
                ) : (
                  <span className={styles.placeholder}>{placeholder}</span>
                )}
              </div>
            )}
            <span className={styles.arrow} />
          </div>
          <ul ref={ref => (this.listNode = ref)} className={styles.list}>
            {options.map(item => (
              <li
                onClick={() => !item.disabled && this.onSelect(item.name)}
                className={classnames(
                  (activeItem.length
                    ? activeItem.includes(item.name)
                    : item.name === activeItem.name) && styles.active,
                  item.disabled && styles.disabled
                )}
                key={item.name}
              >
                {item.title}
                {(activeItem.length ? (
                  activeItem.includes(item.name)
                ) : (
                  item.name === activeItem.name
                )) ? (
                  <span className={styles.icon}>
                    <Icon name="check-right" />
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </OuterClick>
    );
  }
}

export default withStyles(styles)(Select);
