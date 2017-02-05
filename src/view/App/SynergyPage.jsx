import './SynergyPage.scss';
import classNames from 'classnames';
import { effectIcon } from '../../data/effects';
import graph, { getLegend, updateGraph, getEffectColor } from '../../service/graph';
import lang from '../../service/lang';
import * as synergyOptions from '../../service/synergy';
import Icon from '../Icon.jsx';
import { requestRedraw } from '../../util/animation';
/* eslint-disable no-unused-vars */
import m from 'mithril';
/* eslint-enable no-unused-vars */

function config(definition, element, isInitialized) {
    const { top, left, width, height } = element.getBoundingClientRect();
    if(!isInitialized) {
        element.appendChild(graph.canvas);
    }
    updateGraph(definition, top, left, width, height);
}

const SynergyPage = {
    view(ctrl, { stars, effect }) {
        const roster = synergyOptions.getRoster();
        const legend = getLegend({ stars, effect, roster });
        return (
            <div m="SynergyPage" class="synergy" config={ config.bind(null, { stars, effect, roster }) }>
                <div class={ classNames('legend', { 'legend--hidden': !synergyOptions.getLegend() }) }>
                    { legend && legend.map(({ effectId, selected, amount }) => (
                        <div
                            class={ classNames('no-select',
                                'legend-effect',
                                `legend-effect--${ effectId }`,
                                { 'legend-effect--selected': selected }
                            ) }
                            style={ `border-color: ${ getEffectColor(effectId) }` }
                            onclick={ () => {
                                graph.selectEdgeType(effectId);
                                requestRedraw(5);
                            }}
                            title={ lang.string(`effect-${ effectId }-description`) }
                        >
                            <Icon icon={ effectIcon(effectId) } before />
                            <span class="legend-effect-title">
                                { lang.string(`effect-${ effectId }-name`, null) || lang.string(`effect-${ effectId }-type`) }
                                { amount && ` - ${ amount }%` }
                            </span>
                        </div>
                    )) || null }
                    { legend && legend.length === 0 && (
                        <div
                            class={ classNames('no-select', 'legend-effect', 'legend-effect--none') }
                            title={ lang.string('effects-none') }
                        >
                            <Icon icon="times-circle" before/>
                            <span class="legend-effect-title">
                                <i>{ lang.string('effects-none') }</i>
                            </span>
                        </div>
                    ) || null }
                </div>
            </div>
        );
    },
};

export default SynergyPage;
