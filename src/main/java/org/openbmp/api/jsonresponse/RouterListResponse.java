package org.openbmp.api.jsonresponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRootName;
import org.openbmp.api.dto.RouterDTO;

import java.util.List;

@JsonRootName(value = "tablename")
public class RouterListResponse {

    private Integer cols;

    private List<RouterDTO> data;

    private Integer size;

    private Long queryTime_ms;
    private Long fetchTime_ms;


    public RouterListResponse(Integer cols, List<RouterDTO> data, Integer size, Long queryTime_ms, Long fetchTime_ms) {
        this.cols = cols;
        this.data = data;
        this.size = size;
        this.queryTime_ms = queryTime_ms;
        this.fetchTime_ms = fetchTime_ms;
    }


    @JsonProperty("cols")
    public Integer getCols() {
        return cols;
    }

    public void setCols(Integer cols) {
        this.cols = cols;
    }

    @JsonProperty("data")
    public List<RouterDTO> getData() {
        return data;
    }

    public void setData(List<RouterDTO> data) {
        this.data = data;
    }

    @JsonProperty("size")
    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    @JsonProperty("queryTime_ms")
    public Long getQueryTime_ms() {
        return queryTime_ms;
    }

    public void setQueryTime_ms(Long queryTime_ms) {
        this.queryTime_ms = queryTime_ms;
    }

    @JsonProperty("fetchTime_ms")
    public Long getFetchTime_ms() {
        return fetchTime_ms;
    }

    public void setFetchTime_ms(Long fetchTime_ms) {
        this.fetchTime_ms = fetchTime_ms;
    }
}
