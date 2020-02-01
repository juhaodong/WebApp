import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { RouteRoot } from '../menu';
import { searchAddress, GeoCoord, Contact } from '../../service';
import { history, Supplies, factory, Factory } from '../../model';
import CommonSupplies from '../Hospital/Supplies';
import {
    SessionBox,
    AddressField,
    SuppliesField,
    ContactField
} from '../../component';
import { mergeList } from '../../utility';

type FactoryEditProps = Factory & { loading?: boolean };

@component({
    tagName: 'factory-edit',
    renderTarget: 'children'
})
export class FactoryEdit extends mixin<{ srid: string }, FactoryEditProps>() {
    @watch
    srid = '';

    state = {
        loading: false,
        name: '',
        province: '',
        city: '',
        district: '',
        address: '',
        qualification: '',
        coords: {} as GeoCoord,
        url: '',
        supplies: CommonSupplies as Supplies[],
        contacts: [{} as Contact],
        remark: ''
    };

    async connectedCallback() {
        super.connectedCallback();

        if (!this.srid) return;

        await this.setState({ loading: true });

        const {
            name,
            qualification,
            province,
            city,
            district,
            address,
            coords,
            url,
            supplies,
            contacts,
            remark
        } = await factory.getOne(this.srid);

        this.setState({
            loading: false,
            name,
            qualification,
            province,
            city,
            district,
            address,
            coords,
            url,
            supplies: mergeList<Supplies>(
                'name',
                this.state.supplies,
                supplies
            ),
            contacts,
            remark
        });
    }

    changeText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        this.state[name] = value;
    };

    updateText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        event.stopPropagation();

        this.setState({ [name]: value });
    };

    changeAddress = (event: CustomEvent) => {
        const { latitude, longitude, ...rest } = event.detail;

        Object.assign(this.state, {
            ...rest,
            coords: { latitude, longitude }
        });
    };

    handleSubmit = async (event: Event) => {
        event.preventDefault();

        await this.setState({ loading: true });

        const { loading, supplies, ...data } = { ...this.state };

        try {
            await factory.update(
                { ...data, supplies: supplies.filter(({ count }) => count) },
                this.srid
            );
            self.alert('发布成功！');

            history.push(RouteRoot.Hospital);
        } finally {
            await this.setState({ loading: false });
        }
    };

    render(
        _,
        {
            name,
            qualification,
            province,
            city,
            district,
            address,
            url,
            supplies,
            contacts,
            remark,
            loading
        }: FactoryEditProps
    ) {
        return (
            <SessionBox>
                <h2>生产厂商发布</h2>

                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField
                        name="name"
                        required
                        defaultValue={name}
                        label="厂商名字"
                        onChange={this.updateText}
                    />
                    <FormField label="机构地址">
                        <AddressField
                            place={name}
                            {...{ province, city, district, address }}
                            onChange={this.changeAddress}
                        />
                    </FormField>

                    <FormField
                        type="url"
                        name="url"
                        required
                        defaultValue={url}
                        label="官方网址"
                    />
                    <FormField
                        name="qualification"
                        required
                        defaultValue={qualification}
                        label="资质证明"
                    />
                    <SuppliesField
                        list={supplies}
                        onChange={(event: CustomEvent) =>
                            (this.state.supplies = event.detail)
                        }
                    />
                    <ContactField
                        list={contacts}
                        onChange={(event: CustomEvent) =>
                            (this.state.contacts = event.detail)
                        }
                    />
                    <FormField
                        is="textarea"
                        name="remark"
                        label="备注"
                        defaultValue={remark}
                    />
                    <div className="form-group mt-3">
                        <Button type="submit" block disabled={loading}>
                            提交
                        </Button>
                        <Button
                            type="reset"
                            kind="danger"
                            block
                            onClick={() => history.push(RouteRoot.Factory)}
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </SessionBox>
        );
    }
}
