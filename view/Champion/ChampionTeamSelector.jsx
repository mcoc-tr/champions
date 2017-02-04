import './ChampionTeam.scss';
import './ChampionTeamSelector.scss';
import classNames from 'classnames';
import { CHAMPION_PLACEHOLDER } from '../../data/champions';
import effects, { effectIcon } from '../../data/effects';
import roster from '../../service/roster';
import lang from '../../service/lang';
import ChampionPortrait from './ChampionPortrait.jsx';
import Icon from '../Icon.jsx';
import { requestRedraw } from '../../util/animation';
/* eslint-disable no-unused-vars */
import m from 'mithril';
/* eslint-enable no-unused-vars */

const ChampionTeamSelector = {
    view(ctrl, {
        team, swap, create, locked, onclick, onapply, onremove,
        onsplit, onlock, onup, ondown, showBadges,
        draggable, droppable, ondragstart, ondragend, ondragover, ondragleave,
    }) {
        const { source, target } = swap;
        const sourceId = source && source.champion && source.champion.id;
        const targetId = target && target.champion && target.champion.id;
        const { champions, synergies } = team;
        const size = champions.length;
        const editing = champions.reduce((value, champion) => {
            if(create && source && source.create && (sourceId || targetId))
                return source;
            if(champion && champion.id === sourceId)
                return source;
            if(champion && champion.id === targetId)
                return target;
            return value;
        }, null) || null;
        const scalePi = roster.getScale();
        return (
            <div
                m="ChampionTeamSelector"
                class={ classNames('champion-team', 'champion-team-selector', `champion-team--size-${ size }`, {
                    'champion-team-selector--create': create,
                    'champion-team-selector--locked': locked,
                }) }
            >
                <div className="team-champions">
                    { champions.map((champion, index) => (champion)? (
                        <ChampionPortrait
                            key={ `create_${ index }` }
                            champion={ champion }
                            editing={ sourceId === champion.id || targetId === champion.id }
                            showBadges={ showBadges }
                            scalePi={ scalePi }
                            draggable={ draggable }
                            droppable={ droppable }
                            events={{
                                ondragstart: ondragstart && ondragstart.bind(null, index),
                                ondragend: ondragend && ondragend.bind(null, index),
                                ondragover: ondragover && ondragover.bind(null, index),
                                ondragleave: ondragleave && ondragleave.bind(null, index),
                            }}
                            onclick={ locked? null: () => {
                                onclick(index);
                                requestRedraw();
                            }}
                        />
                    ): (
                        <ChampionPortrait
                            key={ `create_${ index }` }
                            champion={ CHAMPION_PLACEHOLDER }
                            editing={ source && source.create && source.index === index }
                            showBadges={ showBadges }
                            droppable={ droppable }
                            events={{
                                ondragover: ondragover && ondragover.bind(null, index),
                                ondragleave: ondragleave && ondragleave.bind(null, index),
                            }}
                            onclick={() => {
                                onclick(index);
                                requestRedraw();
                            }}
                        />
                    )) }
                </div>
                <div className="team-synergies">
                    { effects.map((effect) => {
                        const amount = synergies
                            .filter((synergy) => synergy.attr.effectId === effect.attr.uid)
                            .reduce((value, synergy) => value + synergy.attr.effectAmount, 0);
                        let changed = editing && editing.synergies && editing.synergies
                            .filter((synergy) => synergy.attr.effectId === effect.attr.uid)
                            .reduce((value, synergy) => (value || 0) + synergy.attr.effectAmount, null);
                        if(isNaN(changed)) {
                            changed = null;
                        }
                        if(amount === 0 && changed === null) {
                            return null;
                        }
                        if(changed === null && editing) {
                            changed = 0;
                        }
                        return (
                            <div
                                class={ classNames('team-synergy', 'no-select') }
                                title={ lang.string(`effect-${ effect.attr.uid }-description`) }
                            >
                                <Icon icon={ effectIcon(effect.attr.uid) } before />
                                <span class="effect-name">
                                    { lang.string(`effect-${ effect.attr.uid }-type`) }
                                </span>
                                <span> — </span>
                                <span class="effect-amount">
                                    { changed !== null? changed: amount }%
                                    { (changed !== null && amount !== changed) && (
                                        <span>
                                            (
                                            <span class={ classNames('effect-amount', {
                                                'effect-amount--increased': amount < changed,
                                                'effect-amount--decreased': amount > changed,
                                            }) }>
                                                { Math.abs(amount - changed) }%
                                            </span>
                                            )
                                        </span>
                                    ) || null }
                                </span>
                            </div>
                        );
                    })}
                    <div class="team-pi">
                        { `${ lang.string('base-pi') } ` }
                        <span class="team-pi-number">
                            { lang.number(champions.reduce((amount, champion) => amount + (champion && (champion.attr.pi || champion.pi) || 0), 0)) }
                        </span>
                    </div>
                    { !create && (
                        <div class="team-move">
                            <div
                                class={ classNames('team-move-direction') }
                                onclick={ onlock }
                            >
                                <Icon icon={ locked? 'lock': 'unlock' } />
                            </div>
                            <div
                                class={ classNames('team-move-direction', {
                                    'team-move-direction--disabled': !onup,
                                }) }
                                onclick={ onup }
                            >
                                <Icon icon="caret-up" />
                            </div>
                            <div
                                class={ classNames('team-move-direction', {
                                    'team-move-direction--disabled': !ondown,
                                }) }
                                onclick={ ondown }
                            >
                                <Icon icon="caret-down" />
                            </div>
                        </div>
                    ) || null }
                </div>
                { !swap.dragging && (onremove && (
                    <div class={ classNames('team-remove') } onclick={ onremove }>
                        { lang.string('remove') }
                    </div>
                ) || onsplit && (
                    <div class={ classNames('team-remove') } onclick={ onsplit }>
                        { lang.string('dissolve') }
                    </div>
                ) || onapply && (
                    <div class={ classNames('team-apply', { 'disabled': !swap.target }) } onclick={ onapply }>
                        { lang.string('apply') }
                    </div>
                )) || null }
            </div>
        );
    },
};

export default ChampionTeamSelector;
