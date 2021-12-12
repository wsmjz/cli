<%_if (options.import === 'full') {_%>
import AntUi from 'vue3-libs';
<%_} else {_%>
import { Tabs, Form, Field, Message } from 'vue3-libs';
<%_}_%>


export default app => {
<%_if (options.import === 'full') {_%>
  app.use(AntUi, { message: { key: 'customKey', type: 'error' } })
  <%_} else {_%>
  app
    .use(Tabs)
    .use(Form)
    .use(Field)
    .use(Message, { key: 'customKey', type: 'error' });
  <%_}_%>
}
