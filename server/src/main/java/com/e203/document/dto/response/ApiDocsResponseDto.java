package com.e203.document.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ApiDocsResponseDto {
	private List<String> category;
	private List<String> description;
	private List<String> url;
	private List<String> method;
	private List<String> functionName;
	private List<String> frontOwner;
	private List<String> backOwner;
	private List<Integer> frontState;
	private List<Integer> backState;
	private List<String> priority;
	private List<String> requestHeader;
	private List<String> responseHeader;
	private List<String> requestBody;
	private List<String> responseBody;


}
