import useSWR from "swr";
import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import { formatProxyUrl } from "utils/proxy/api-helpers";

export default function Component({ service }) {
  const { t } = useTranslation("common");

  const config = service.widget;

  const { data: statusData, error: statusError } = useSWR(formatProxyUrl(config, "status"));

  if (statusError) {
    return <Container error={t("widget.api_error")} />;
  }

  if (!statusData) {
    return (
      <Container>
        <Block label={t("nzbget.rate")} />
        <Block label={t("nzbget.remaining")} />
        <Block label={t("nzbget.downloaded")} />
      </Container>
    );
  }

  return (
    <Container>
      <Block label={t("nzbget.rate")} value={t("common.bitrate", { value: statusData.DownloadRate })} />
      <Block
        label={t("nzbget.remaining")}
        value={t("common.bytes", { value: statusData.RemainingSizeMB * 1024 * 1024 })}
      />
      <Block
        label={t("nzbget.downloaded")}
        value={t("common.bytes", { value: statusData.DownloadedSizeMB * 1024 * 1024 })}
      />
    </Container>
  );
}