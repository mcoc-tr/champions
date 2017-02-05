import './TeamsSettingsPage.scss';
import classNames from 'classnames';
import effects, { effectIcon } from '../../data/effects';
import teams, { save } from '../../service/teams';
import lang from '../../service/lang';
import Icon from '../Icon.jsx';
import { requestRedraw } from '../../util/animation';
/* eslint-disable no-unused-vars */
import m from 'mithril';
/* eslint-enable no-unused-vars */

const DUPLICATE_TITLES = {
    2: 'double',
    3: 'triple',
    4: 'quadruple',
    5: 'quintuple',
};

const Slider = {
    view(ctrl, { object, field, toInputValue, fromInputValue }) {
        return (
            <input
                class="field-slider"
                type="range"
                min="0"
                max="1000"
                step="1"
                value={ toInputValue(object[ field ]) }
                oninput={ (event) => {
                    object[ field ] = fromInputValue(event.target.value);
                    save();
                    requestRedraw(10);
                } }
            />
        );
    },
};

const Checkbox = {
    view(ctrl, { object, field }) {
        return (
            <div
                class="field-checkbox no-select"
                onclick={() => {
                    object[ field ] = !object[ field ];
                    save();
                    requestRedraw(10);
                }}
            >
                <Icon icon={ (object[ field ])? 'check-square-o': 'square-o' } before />
                { lang.string((object[ field ])? 'enabled': 'disabled') }
            </div>
        );
    },
};

const Field = {
    view(ctrl, { title, icon, description, alt, input, value, hasLargeValue }) {
        return (
            <div class="field">
                <label class="field-name">
                    { icon }
                    { title }
                </label>
                <div class="field-content">
                    { (description !== undefined)? (
                        <div class="field-description">{ description }</div>
                    ): null }
                    { (input !== undefined)? (
                        <div class={ classNames('field-input',
                            { 'field-input-small': (value !== undefined) && !hasLargeValue },
                            { 'field-input-large': (value !== undefined) && hasLargeValue }
                        )}>
                            { input }
                        </div>
                    ): null }
                    { (value !== undefined)? (
                        <span class="field-value">
                            { lang.number(value) }
                        </span>
                    ): null }
                    { (alt !== undefined)? (
                        <div class="field-description-alt">{ alt }</div>
                    ): null }
                </div>
            </div>
        );
    },
};

const TeamsSettingsPage = {
    view() {
        return (
            <div m="TeamsSettingsPage" class="teams-settings">
                <div class="teams-settings-section">
                    <div class="header">
                        { lang.string('general-settings') }
                    </div>
                    <Field
                        title={ lang.string('arena-sandbagging') }
                        icon={(
                            <Icon icon="users" before />
                        )}
                        description={ lang.string('arena-sandbagging-description') }
                        input={(
                            <Checkbox object={ teams } field={ 'sandbagging' } />
                        )}
                    />

                    <Field
                        title={ lang.string('willpower-safe') }
                        icon={(
                            <Icon icon="user-secret" before />
                        )}
                        description={ lang.string('willpower-safe-description') }
                        input={(
                            <Checkbox object={ teams } field={ 'willpowersafe' } />
                        )}
                    />
                    <Field
                        title={ lang.string('base-weight') }
                        icon={(
                            <Icon icon="database" before />
                        )}
                        description={ lang.string('base-weight-description') }
                        input={
                            <Slider
                                object={ teams.weights }
                                field={ 'base' }
                                toInputValue={ (value) => value * 1000 }
                                fromInputValue={ (value) => value / 1000 }
                            />
                        }
                        value={ (teams.weights[ 'base' ] * 1000 | 0) / 10 }
                    />
                </div>
                <div class="teams-settings-section">
                    <div class="header">
                        { lang.string('synergy-weights') }
                    </div>
                    { effects.map(({ attr }) => (
                        <Field
                            title={ lang.string(`effect-${ attr.uid }-name`, null) || lang.string(`effect-${ attr.uid }-type`) }
                            description={ lang.string(`effect-${ attr.uid }-description`, null) }
                            icon={(
                                <Icon icon={ effectIcon(attr.uid) } before />
                            )}
                            input={
                                <Slider
                                    object={ teams.weights }
                                    field={ attr.uid }
                                    toInputValue={ (value) => value * 1000 }
                                    fromInputValue={ (value) => value / 1000 }
                                />
                            }
                            value={ (teams.weights[ attr.uid ] * 1000 | 0) / 10 }
                        />
                    )) }
                </div>
                <div class="teams-settings-section">
                    <div class="header">
                        { lang.string('duplicate-weights') }
                    </div>
                    { [ 2, 3, 4, 5 ].map((count) => (
                        <Field
                            title={ `${ lang.string(DUPLICATE_TITLES[ count ]) }` }
                            icon={(
                                <span class="field-name--bold">{ `${ count }x ` }</span>
                            )}
                            input={
                                <Slider
                                    object={ teams.weights }
                                    field={ `duplicates-${ count }` }
                                    toInputValue={ (value) => value * 1000 }
                                    fromInputValue={ (value) => value / 1000 }
                                />
                            }
                            value={ (teams.weights[ `duplicates-${ count }` ] * 1000 | 0) / 10 }
                        />
                    )) }
                </div>
                <div class="teams-settings-section">
                    <div class="header">
                        { lang.string('pi-range') }
                    </div>
                    { [
                        { which: 'minimum-champion', iconType: 'user', icon: 'step-backward', maximum: 10000 },
                        { which: 'maximum-champion', iconType: 'user', icon: 'step-forward', maximum: 10000 },
                        { which: 'minimum-team', iconType: 'users', icon: 'step-backward', maximum: 50000 },
                        { which: 'maximum-team', iconType: 'users', icon: 'step-forward', maximum: 50000 },
                    ].map(({ which, iconType, icon, maximum }) => (
                        <Field
                            title={ lang.string(`pi-range-${ which }`) }
                            icon={[
                                (
                                <Icon icon={ iconType } before />
                                ),
                                (
                                <Icon icon={ icon } before />
                                ),
                            ]}
                            input={
                                <Slider
                                    object={ teams.range }
                                    field={ which }
                                    toInputValue={ (value) => 1000 * value / maximum }
                                    fromInputValue={ (value) => maximum * value / 1000 }
                                />
                            }
                            value={ teams.range[ which ] | 0 }
                            hasLargeValue
                        />
                    )) }
                </div>
                <div class="clear" />
            </div>
        );
    },
};
export default TeamsSettingsPage;
